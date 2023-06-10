<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\AmentiesRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\NotBlank;

#[ORM\Entity(repositoryClass: AmentiesRepository::class)]
#[ApiResource
(
    description: 'Amenities rest endpoint',
    operations: [
        new Get(
            security: 'is_granted("ROLE_ADMIN")',
        ),
        new GetCollection(),
        new Post(
            security: 'is_granted("ROLE_ADMIN")',
        ),
        new Patch(
            security: 'is_granted("ROLE_ADMIN")',
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN")',
        )
    ],


    normalizationContext: [
        'groups' => ['amenities:read'],
    ],
    denormalizationContext: [
        'groups' => ['amenities:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],
)]
class Amenties
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['amenities:read','amenities:write','ground:read','ground:write'])]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $hasShower = null;

    #[ORM\Column]
    #[Groups(['amenities:read','amenities:write','ground:read','ground:write'])]
    #[Assert\NotBlank]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $hasSecureStorage = null;

    #[ORM\Column]
    #[Groups(['amenities:read','amenities:write','ground:read','ground:write'])]
    #[Assert\NotBlank]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $hasChangingRoom = null;

    #[ORM\Column]
    #[Groups(['amenities:read','amenities:write','ground:read','ground:write'])]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $hasRestaurent = null;

    #[ORM\Column]
    #[Groups(['amenities:read','amenities:write','ground:read','ground:write'])]
    #[Assert\NotBlank]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $hasParking = null;

    #[ORM\OneToOne(inversedBy: 'amenties')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['amenities:read','amenities:write','ground:read','ground:write'])]
    private ?Pitch $pitch = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isHasShower(): ?bool
    {
        return $this->hasShower;
    }

    public function setHasShower(bool $hasShower): self
    {
        $this->hasShower = $hasShower;

        return $this;
    }

    public function isHasSecureStorage(): ?bool
    {
        return $this->hasSecureStorage;
    }

    public function setHasSecureStorage(bool $hasSecureStorage): self
    {
        $this->hasSecureStorage = $hasSecureStorage;

        return $this;
    }

    public function isHasChangingRoom(): ?bool
    {
        return $this->hasChangingRoom;
    }

    public function setHasChangingRoom(bool $hasChangingRoom): self
    {
        $this->hasChangingRoom = $hasChangingRoom;

        return $this;
    }

    public function isHasRestaurent(): ?bool
    {
        return $this->hasRestaurent;
    }

    public function setHasRestaurent(bool $hasRestaurent): self
    {
        $this->hasRestaurent = $hasRestaurent;

        return $this;
    }

    public function isHasParking(): ?bool
    {
        return $this->hasParking;
    }

    public function setHasParking(bool $hasParking): self
    {
        $this->hasParking = $hasParking;

        return $this;
    }

    public function getPitch(): ?Pitch
    {
        return $this->pitch;
    }

    public function setPitch(Pitch $pitch): self
    {
        $this->pitch = $pitch;

        return $this;
    }
}
