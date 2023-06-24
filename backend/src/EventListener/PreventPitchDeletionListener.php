<?php

namespace App\EventListener;

use App\Entity\Pitch;
use App\Entity\Reservation;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class PreventPitchDeletionListener
{
    public function preRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();

        if ($entity instanceof Pitch) {
            $reservations = $entity->getReservations();

            if (!empty($reservations)) {
                foreach ($reservations as $reservation) {
                    if ($reservation instanceof Reservation && !$reservation->getIsCancelled()) {
                        throw new \Exception("Cannot delete Pitch. There are active reservations associated with it.");
                    }
                }
            }
        }
    }
}