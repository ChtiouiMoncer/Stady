<?php

namespace App\EventSubscriber;

use App\Entity\OpeningTime;
use App\Entity\Pitch;
use App\Entity\TimeSlot;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\EntityManagerInterface;

class PitchEventListener
{
    private $entityManager;

    // The constructor injects the EntityManager service
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    // This method triggers after a Pitch object is updated
    public function postUpdate(LifecycleEventArgs $args): void
    {
        // Get the updated entity
        $pitch = $args->getObject();

        // If the entity is not a Pitch, we're not interested
        if (!$pitch instanceof Pitch) {
            return;
        }

        // Get the Unit of Work from the Entity Manager
        $uow = $args->getObjectManager()->getUnitOfWork();

        // Compute changesets for all managed entities
        $uow->computeChangeSets();

        // Get the changeset of the Pitch entity
        $changeset = $uow->getEntityChangeSet($pitch);

        // Only run the following logic if either 'isPending' and 'isApproved' fields were updated
        if (!isset($changeset['isPending']) && !isset($changeset['isApproved'])) {
            return;
        }

        // Get the values of the IsPending & IsApproved properties
        $isPending = $pitch->getIsPending();
        $isApproved = $pitch->getIsApproved();

        // Check if the pitch is not approved or still pending. If so, exit this method.
        if (!$isApproved || $isPending) {
            return;
        }

        // Get the EntityManager to manage the database operations
        $em = $args->getObjectManager();

        // Get all OpeningTimes for the Pitch
        $openingTimes = $pitch->getOpeningTimes();

        // Loop through each OpeningTime
        foreach ($openingTimes as $openingTime) {

            // If the pitch is closed, don't create any time slots
            if ($openingTime->getIsClosed()) {
                continue;
            }

            // Define the interval of each timeslot based on the OpeningTime's interval
            $interval = new \DateInterval(sprintf('PT%dM', $openingTime->getInterval()));

            // Set the date range for generating the timeslots: from today to one month later
            //$startDate = (new \DateTime());
            //$endDate = (new \DateTime())->modify('+1 month');
            $startDate = (new \DateTime())->modify('+1 day'); //start the timeslots from tomorrow
            $endDate = (new \DateTime())->modify('+1 month')->modify('+1 day'); //the end date is set to one month from tomorrow

            // Get the day of the week for this OpeningTime
            $dayOfWeek = strtolower($openingTime->getDay());

            // Loop through each day in the date range (month)
            for ($date = clone $startDate; $date < $endDate; $date->modify('+1 day')) {

                // If the current day of the week is not the same as the OpeningTime's day, skip this day
                if (strtolower($date->format('l')) !== $dayOfWeek) {
                    continue; //end the current iteration in a for , foreach , while or do while loop
                }

                // Reset startTime and endTime to openTime at start of each day
                $startTime = clone $openingTime->getOpenTime();
                $endTime = (clone $startTime)->add($interval);

                // Loop through the opening hours of the current day, create a new TimeSlot for each interval
                while ($endTime <= $openingTime->getCloseTime()) {

                    // Create a new TimeSlot
                    $timeSlot = new TimeSlot();

                    // Set the properties of the TimeSlot
                    $timeSlot->setStartTime(clone $startTime);
                    $timeSlot->setEndTime(clone $endTime);
                    $timeSlot->setPrice($openingTime->getPrice());
                    $timeSlot->setDate(clone $date);
                    $timeSlot->setIsAvailable(true);
                    $timeSlot->setOpeningTime($openingTime);
                    $timeSlot->setIsOutdated(false);
                    $timeSlot->setPitch($openingTime->getPitch());

                    // Make the EntityManager aware of this new entity to be inserted into the database
                    $em->persist($timeSlot);

                    // Move to the next timeslot
                    $startTime->add($interval);
                    $endTime->add($interval);
                }
            }
        }

        // Flush all newly created TimeSlot entities
        $em->flush();
    }

    // This method generates timeslots for all approved pitches
    public function generateTimeSlotsForAllApprovedPitches(): void
    {
        // Fetch all approved pitches
        $pitches = $this->entityManager->getRepository(Pitch::class)->findBy(['isApproved' => true, 'isPending' => false, 'isPaused' => false]);

        // Generate timeslots for each pitch
        foreach ($pitches as $pitch) {
            $this->generateTimeSlotsForPitch($pitch);
        }
    }

    // This method generates timeslots for a given pitch
    public function generateTimeSlotsForPitch(Pitch $pitch): void
    {
        // Start with the same logic as postUpdate methode (isApproved & isPending verification in the above methode)
        $openingTimes = $pitch->getOpeningTimes();

        foreach ($openingTimes as $openingTime) {

            if ($openingTime->getIsClosed()) {
                continue;
            }

            $interval = new \DateInterval(sprintf('PT%dM', $openingTime->getInterval()));

            $startDate = new \DateTime(); // start the timeslots from today
            $endDate = (new \DateTime())->modify('+1 month'); // the end date is set to one month from today
            $dayOfWeek = strtolower($openingTime->getDay());

            for ($date = clone $startDate; $date < $endDate; $date->modify('+1 day')) {

                if (strtolower($date->format('l')) !== $dayOfWeek) {
                    continue;
                }

                $startTime = clone $openingTime->getOpenTime();
                $endTime = (clone $startTime)->add($interval);

                while ($endTime <= $openingTime->getCloseTime()) {

                    // Check if the timeslot already exists
                    $existingTimeSlot = $this->entityManager->getRepository(TimeSlot::class)->findOneBy([
                        'date' => clone $date,
                        'startTime' => clone $startTime,
                        'endTime' => clone $endTime,
                        'openingTime' => $openingTime,
                        'isOutdated' => false

                    ]);

                    //The next both if statements, continue is used to skip creating a new timeslot

                    // If the timeslot already exists and is not available (booked), skip to the next timeslot
                    if ($existingTimeSlot && !$existingTimeSlot->getIsAvailable()) {
                        // Move our "cursor" to the next timeslot for this openingTime
                        $startTime->add($interval);
                        $endTime->add($interval);
                        //Go back to the start of the while loop and begin the next iteration.
                        continue;
                    }

                    // If the timeslot already exists and is available, move to the next timeslot without creating a new one
                    if ($existingTimeSlot && $existingTimeSlot->getIsAvailable()) {
                        $startTime->add($interval);
                        $endTime->add($interval);
                        continue;
                    }

                    // If the timeslot doesn't exist, create a new one
                    $timeSlot = new TimeSlot();
                    $timeSlot->setStartTime(clone $startTime);
                    $timeSlot->setEndTime(clone $endTime);
                    $timeSlot->setPrice($openingTime->getPrice());
                    $timeSlot->setDate(clone $date);
                    $timeSlot->setIsAvailable(true);
                    $timeSlot->setOpeningTime($openingTime);
                    $timeSlot->setIsOutdated(false);
                    $timeSlot->setPitch($openingTime->getPitch());


                    // Make the EntityManager aware of this new entity to be inserted into the database
                    $this->entityManager->persist($timeSlot);

                    // Move to the next timeslot
                    $startTime->add($interval);
                    $endTime->add($interval);
                }
            }
        }

        // Flush all newly created TimeSlot entities
        $this->entityManager->flush();
    }

    public function markOutdatedTimeSlots(): void
    {
        // Fetch all TimeSlots with startTime < now and isOutdated = false
        $outdatedTimeSlots = $this->entityManager->getRepository(TimeSlot::class)->findByStartTimeBeforeAndIsOutdated(false, new \DateTime());

        // Loop over each outdated TimeSlot and set isOutdated to true
        foreach ($outdatedTimeSlots as $timeSlot) {
            $timeSlot->setIsOutdated(true);
        }


        // Persist changes to the database
        $this->entityManager->flush();
    }
}
