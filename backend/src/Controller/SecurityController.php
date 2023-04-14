<?php

namespace App\Controller;

use ApiPlatform\Api\IriConverterInterface;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class SecurityController extends AbstractController
{
    //#[Route('/logout', name: 'app_logout')]
    public function logout():void {

        throw new \Exception('This should never be reached');
    }


}