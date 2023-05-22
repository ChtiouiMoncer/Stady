<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\TimeSlotRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;

#[ORM\Entity(repositoryClass: TimeSlotRepository::class)]
#[ApiResource
(
    description: 'TimeSlot rest endpoint',
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
        'groups' => ['timeSlot:read'],
    ],
    denormalizationContext: [
        'groups' => ['timeSlot:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],
)
]
class TimeSlot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['timeSlot:read','timeSlot:write','ground:read','ground:write','user:read','user:write'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TIME_MUTABLE, nullable: true)]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'H:i:s'])] //"Format: HH:MM:SS"
    #[Groups(['timeSlot:read','timeSlot:write','ground:read','ground:write','user:read','user:write'])]
        private ?\DateTimeInterface $startTime = null;

    #[ORM\Column(type: Types::TIME_MUTABLE, nullable: true)]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'H:i:s'])] //"Format: HH:MM:SS"
    #[Groups(['timeSlot:read','timeSlot:write','ground:read','ground:write','user:read','user:write'])]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['timeSlot:read','timeSlot:write','ground:read','ground:write','user:read','user:write'])]
    private ?float $price = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d H:i:s'])] //"Format: YYYY-MM-DD HH:MM:SS"
    #[Groups(['timeSlot:read','timeSlot:write','ground:read','ground:write','user:read','user:write'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['timeSlot:read','timeSlot:write','ground:read','ground:write','user:read','user:write'])]
    private ?bool $isAvailable = null;

    #[ORM\ManyToOne(inversedBy: 'timeSlots')]
    #[Groups(['timeSlot:read','timeSlot:write','ground:read','ground:write','user:read','user:write'])]
    private ?OpeningTime $openingTime = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(?\DateTimeInterface $startTime): self
    {
        $this->startTime = $startTime;

        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(?\DateTimeInterface $endTime): self
    {
        $this->endTime = $endTime;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function isIsAvailable(): ?bool
    {
        return $this->isAvailable;
    }

    public function setIsAvailable(?bool $isAvailable): self
    {
        $this->isAvailable = $isAvailable;

        return $this;
    }

    public function getOpeningTime(): ?OpeningTime
    {
        return $this->openingTime;
    }

    public function setOpeningTime(?OpeningTime $openingTime): self
    {
        $this->openingTime = $openingTime;

        return $this;
    }
}
