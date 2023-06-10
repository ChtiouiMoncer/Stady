<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\SportsTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\NotBlank;

#[ORM\Entity(repositoryClass: SportsTypeRepository::class)]
#[ApiResource(
    description: 'SportsType rest endpoint',
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
        'groups' => ['type:read'],
    ],
    denormalizationContext: [
        'groups' => ['type:write'],
    ],
    paginationItemsPerPage: 10,
    extraProperties: [
        'standard_put' => true,
    ],
)]
class SportsType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['type:read','ground:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['type:read','type:write','ground:item:get','ground:read'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:5, max: 20, maxMessage: 'Describe the Sports Type in 20 char max!')]
    #[ApiFilter(SearchFilter::class, strategy: 'partial')]
    private ?string $SportsName = null;

    #[ORM\OneToMany(mappedBy: 'sportsType', targetEntity: Pitch::class)]
    #[Groups(['type:read','type:write'])]
    private Collection $pitch;

    #[ORM\OneToMany(mappedBy: 'sportsType', targetEntity: FloorType::class)]
    #[Groups(['type:read','type:write'])]
    #[Assert\Valid]
    #[Assert\NotBlank]
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
