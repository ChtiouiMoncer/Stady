<?php

namespace App\EventSubscriber;


use App\Entity\OpeningTime;
use App\Entity\TimeSlot;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class OpeningTimeEventListener
{
    public function postPersist(LifecycleEventArgs $args): void
    {
        $openingTime = $args->getObject();

        // If the entity is not an OpeningTime, we're not interested
        if (!$openingTime instanceof OpeningTime) {
            return;
        }

        $em = $args->getObjectManager();

        $interval = new \DateInterval(sprintf('PT%dM', $openingTime->getInterval()));
        $nextDayDate = (new \DateTime())->modify('next ' . strtolower($openingTime->getDay()));

        $startTime = clone $openingTime->getOpenTime();
        $endTime = clone $openingTime->getOpenTime()->add($interval);

        while ($endTime <= $openingTime->getCloseTime()) {
            $timeSlot = new TimeSlot();
            $timeSlot->setStartTime(clone $startTime);
            $timeSlot->setEndTime(clone $endTime);
            $timeSlot->setIsAvailable(false);
            $timeSlot->setPrice($openingTime->getPrice());
            $timeSlot->setDate(clone $nextDayDate);
            $timeSlot->setOpeningTime($openingTime);

            $em->persist($timeSlot);

            $startTime->add($interval);
            $endTime->add($interval);
        }

        // Flush all newly created TimeSlot entities
        $em->flush();
    }
}
