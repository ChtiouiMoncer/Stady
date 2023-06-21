<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model;
use App\Controller\ImageUploadController;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ImageRepository;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;



#[Vich\Uploadable]
#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[ApiResource(
    types: ['https://schema.org/Image'],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
            controller: ImageUploadController::class,
            openapi: new Model\Operation(
                requestBody: new Model\RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'imageFile' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            ),
            security: 'is_granted("ROLE_ADMIN") or is_granted("ROLE_OWNER") ',
            validationContext: ['groups' => ['Default', 'image_create']],
            deserialize: false
        )
    ],
    normalizationContext: ['groups' => ['image:read']]
)]


class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ground:read','image:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['ground:read','image:read'])]
    private ?string $title = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'])]
    #[Groups(['ground:read','image:read'])]
    public ?string $contentUrl = null;

    #[ORM\Column(length: 255)]
    #[Groups(['ground:read','image:read'])]
    private ?string $imageName = null;

    // NOTE: This is not a mapped field of entity metadata, just a simple property.
    #[Vich\UploadableField(mapping: 'images_upload', fileNameProperty: 'imageName')]
    private ?\Symfony\Component\HttpFoundation\File\File  $imageFile = null;
    #[ORM\Column(nullable: true)]
    #[Groups(['ground:read','image:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[Groups(['ground:read','image:read'])]
    private ?Pitch $pitch = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    /**
     * @param string|null $imageName
     */
    public function setImageName(?string $imageName): void
    {
        $this->imageName = $imageName;
    }

    /**
     * @return \Symfony\Component\HttpFoundation\File\File
     */
    public function getImageFile(): \Symfony\Component\HttpFoundation\File\File
    {
        return $this->imageFile;
    }

    /**
     * @param File|null $imageFile
     */
    public function setImageFile(?File $imageFile): void
    {
        $this->imageFile = $imageFile;
        if (null !== $imageFile){
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    /**
     * @return string|null
     */
    public function getContentUrl(): ?string
    {
        return '/uploads/images/' . $this->imageName;
    }



    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getPitch(): ?Pitch
    {
        return $this->pitch;
    }

    public function setPitch(?Pitch $pitch): self
    {
        $this->pitch = $pitch;
        return $this;
    }


}
