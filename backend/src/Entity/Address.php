<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\AddressRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AddressRepository::class)]
#[ApiResource
(
    description: 'Address rest endpoint',
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
        'groups' => ['address:read'],
    ],
    denormalizationContext: [
        'groups' => ['address:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],
)]
class Address
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['address:read','address:write','ground:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['address:read','address:write','ground:read','ground:write'])]
    private ?string $longitude = null;

    #[ORM\Column(length: 255)]
    #[Groups(['address:read','address:write','ground:read','ground:write'])]
    private ?string $latitude = null;

    #[ORM\OneToOne(inversedBy: 'address')]
    #[Groups(['address:read','address:write','ground:read','ground:write'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Pitch $pitch = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(string $latitude): self
    {
        $this->latitude = $latitude;

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
