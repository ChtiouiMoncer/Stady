<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[ApiResource(
    description: 'Image rest endpoint',
    operations: [
        new Get(
            normalizationContext: ['groups' => ['image:read','image:item:get']]
        ),
        new GetCollection(),
        new Post(
            security: 'is_granted("ROLE_MEMBER")',
        ),
        new Delete(
            security: 'is_granted("ROLE_MEMBER")',
        )
    ],
    normalizationContext: [
        'groups' => ['image:read'],
    ],
    denormalizationContext: [
        'groups' => ['image:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],

)]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['image:read','image:write','ground:read'])]

    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['image:read','image:write','ground:read','ground:write'])]
    private ?string $imagePath = null;

    #[ORM\Column]
    #[Groups(['image:read','image:write','ground:read','ground:write'])]
    private ?int $width = null;

    #[ORM\Column]
    #[Groups(['image:read','image:write','ground:read','ground:write'])]
    private ?int $height = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[Groups(['image:read','image:write','ground:read','ground:write'])]
    private ?Pitch $pitch = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImagePath(): ?string
    {
        return $this->imagePath;
    }

    public function setImagePath(string $imagePath): self
    {
        $this->imagePath = $imagePath;

        return $this;
    }

    public function getWidth(): ?int
    {
        return $this->width;
    }

    public function setWidth(int $width): self
    {
        $this->width = $width;

        return $this;
    }

    public function getHeight(): ?int
    {
        return $this->height;
    }

    public function setHeight(int $height): self
    {
        $this->height = $height;

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
