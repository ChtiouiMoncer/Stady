<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AmentiesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AmentiesRepository::class)]
#[ApiResource]
class Amenties
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $hasShower = null;

    #[ORM\Column]
    private ?bool $hasSecureStorage = null;

    #[ORM\Column]
    private ?bool $hasChangingRoom = null;

    #[ORM\Column]
    private ?bool $hasRestaurent = null;

    #[ORM\Column]
    private ?bool $hasParking = null;

    #[ORM\OneToOne(inversedBy: 'amenties', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
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
