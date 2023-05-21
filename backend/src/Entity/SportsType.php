<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SportsTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SportsTypeRepository::class)]
#[ApiResource]
class SportsType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $SportsName = null;

    #[ORM\OneToMany(mappedBy: 'sportsType', targetEntity: Pitch::class)]
    private Collection $pitch;

    #[ORM\OneToMany(mappedBy: 'sportsType', targetEntity: FloorType::class)]
    private Collection $floorTypes;

    public function __construct()
    {
        $this->pitch = new ArrayCollection();
        $this->floorTypes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSportsName(): ?string
    {
        return $this->SportsName;
    }

    public function setSportsName(?string $SportsName): self
    {
        $this->SportsName = $SportsName;

        return $this;
    }

    /**
     * @return Collection<int, Pitch>
     */
    public function getPitch(): Collection
    {
        return $this->pitch;
    }

    public function addPitch(Pitch $pitch): self
    {
        if (!$this->pitch->contains($pitch)) {
            $this->pitch->add($pitch);
            $pitch->setSportsType($this);
        }

        return $this;
    }

    public function removePitch(Pitch $pitch): self
    {
        if ($this->pitch->removeElement($pitch)) {
            // set the owning side to null (unless already changed)
            if ($pitch->getSportsType() === $this) {
                $pitch->setSportsType(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, FloorType>
     */
    public function getFloorTypes(): Collection
    {
        return $this->floorTypes;
    }

    public function addFloorType(FloorType $floorType): self
    {
        if (!$this->floorTypes->contains($floorType)) {
            $this->floorTypes->add($floorType);
            $floorType->setSportsType($this);
        }

        return $this;
    }

    public function removeFloorType(FloorType $floorType): self
    {
        if ($this->floorTypes->removeElement($floorType)) {
            // set the owning side to null (unless already changed)
            if ($floorType->getSportsType() === $this) {
                $floorType->setSportsType(null);
            }
        }

        return $this;
    }
}
