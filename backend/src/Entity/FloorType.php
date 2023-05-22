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
use App\Repository\FloorTypeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\NotBlank;
#[ORM\Entity(repositoryClass: FloorTypeRepository::class)]
#[ApiResource(
    description: 'FloorType rest endpoint',
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
        'groups' => ['floor_type:read'],
    ],
    denormalizationContext: [
        'groups' => ['floor_type:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],
)]
class FloorType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['floor_type:read','floor_type:write','ground:read','user:read','user:write'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:5, max: 20, maxMessage: 'Describe the Sports Floor Type in 20 char max!')]
    #[ApiFilter(SearchFilter::class, strategy: 'partial')]
    private ?string $floorName = null;

    #[ORM\ManyToOne(inversedBy: 'floorTypes')]
    #[Groups(['floor_type:read','floor_type:write','ground:read','user:read','user:write'])]
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
