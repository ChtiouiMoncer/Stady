<?php
// src/Controller/EmailController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mime\Address;

class EmailController extends AbstractController
{
    /**
     * @Route("/api/send_email", name="send_email", methods={"POST"})
     */
    public function sendEmail(MailerInterface $mailer, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $email = (new TemplatedEmail())
            ->from(new Address('your_email@gmail.com', 'Your App'))
            ->to(new Address($data['userEmail']))
            ->subject('Your Reservation QR Code')
            ->htmlTemplate('emails/reservation.html.twig')
            ->context([
                'qrCode' => $data['qrCode'], // Add more context variables as needed
            ]);

        $mailer->send($email);

        return new Response('Email sent!', Response::HTTP_OK);
    }
}
