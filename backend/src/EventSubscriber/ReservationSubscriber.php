<?php

namespace App\EventSubscriber;


use App\Entity\Reservation;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\ORM\EntityManagerInterface;

class ReservationSubscriber
{
    public function postUpdate(LifecycleEventArgs $args): void
    {
        //GET the updated object
        $entity = $args->getObject();

        //if the object is not reservation we are not interested
        if (!$entity instanceof Reservation) {
            return;
        }

        // Check if the reservation is cancelled
        if ($entity->getIsCancelled() !== true) {
            return;
        }

        // Check if the reservation is outdated
        $now = new \DateTime();
        foreach ($entity->getTimeSlots() as $timeSlot) {
            if ($timeSlot->getIsOutdated()) {
                throw new \Exception('Cannot cancel a reservation that is outdated.');
            }


            // Check if one of the timeslots reservation start time is about to start less than 10 min.
            $now = new \DateTime();

            $timeSlotDate = $timeSlot->getDate();
            $timeSlotTime = $timeSlot->getStartTime();

            // Create a new DateTime object combining the date and time of the timeSlot
            $timeSlotDateTime = (clone $timeSlotDate)->setTime(
                (int)$timeSlotTime->format('H'),
                (int)$timeSlotTime->format('i'),
                (int)$timeSlotTime->format('s')
            );

            // Check if the timeslot's start date and time is about to start less than 10 min.
            if (($timeSlotDateTime->getTimestamp() - $now->getTimestamp()) < 600) {
                throw new \Exception('Cannot cancel a reservation that have a timeslot that is going to start less than 10min from now.');
            }


            // Check if the reservation is not already available
            if ($timeSlot->getIsAvailable()) {
                throw new \Exception('Cannot cancel a reservation that is already available.');
            }

            // Set the timeslot as available
            $timeSlot->setIsAvailable(true);
        }

        $args->getObjectManager()->flush();
    }

}