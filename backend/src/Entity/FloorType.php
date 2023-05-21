<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\FloorTypeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FloorTypeRepository::class)]
#[ApiResource]
class FloorType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $floorName = null;

    #[ORM\ManyToOne(inversedBy: 'floorTypes')]
    private ?SportsType $sportsType = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFloorName(): ?string
    {
        return $this->floorName;
    }

    public function setFloorName(?string $floorName): self
    {
        $this->floorName = $floorName;

        return $this;
    }

    public function getSportsType(): ?SportsType
    {
        return $this->sportsType;
    }

    public function setSportsType(?SportsType $sportsType): self
    {
        $this->sportsType = $sportsType;

        return $this;
    }
}
