<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedListener
{



    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser(); // Get the authenticated user object from the event

        $request = $this->requestStack->getCurrentRequest(); // Retrieve the current request object

        $payload = $event->getData(); // Retrieve the existing payload data from the event

        $payload['ip'] = $request->getClientIp(); // Add the client IP address to the payload data
        $payload['userId'] = $user->getId(); // Add the user ID to the payload data

        $event->setData($payload); // Update the payload data in the event with the modified payload

        //$header = $event->getHeader(); // Retrieve the existing header data from the event

        //$header['cty'] = 'JWT'; // Add a new claim to the header called 'cty' and set its value to 'JWT'

        //$event->setHeader($header); // Update the header data in the event with the modified header
    }


}