<?php

namespace App\Controller;

use App\Entity\Image;
use App\Entity\Pitch;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class ImageUploadController
{
    public function __invoke(Request $request, EntityManagerInterface $em): Image
    {
        $uploadedFile = $request->files->get('imageFile');
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"imageFile" is required');
        }

        // Get pitch URL from the request
        $pitchUrl = $request->request->get('pitch');

        // Extract pitch ID from the URL
        $pitchId = intval(substr($pitchUrl, strrpos($pitchUrl, '/') + 1));

        // Find pitch by ID
        $pitch = $em->getRepository(Pitch::class)->find($pitchId);

        // Check if pitch exists
        if (!$pitch) {
            throw new BadRequestHttpException('Pitch not found');
        }

        $image = new Image();
        $image->setTitle($request->request->get('title'));
        $image->setImageFile($uploadedFile); // Here you need to pass the uploaded file
        $image->setUpdatedAt(new \DateTimeImmutable());

        // Set the pitch on the image
        $image->setPitch($pitch);

        return $image;
    }
}