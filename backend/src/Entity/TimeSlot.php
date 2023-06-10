<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Odm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Metadata\ApiFilter;
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
            normalizationContext: ['groups' => ['timeSlot:read','timeSlot:item:get']]

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
)]
#[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, properties: ["pitch.name" => 'exact'] )]

class TimeSlot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['timeSlot:read','opening_time:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TIME_MUTABLE, nullable: true)]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'H:i:s'])] //"Format: HH:MM:SS"
    #[Groups(['timeSlot:read','timeSlot:write','opening_time:read','reservation:read'])]
    private ?\DateTimeInterface $startTime = null;

    #[ORM\Column(type: Types::TIME_MUTABLE, nullable: true)]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'H:i:s'])] //"Format: HH:MM:SS"
    #[Groups(['timeSlot:read','timeSlot:write','opening_time:read','reservation:read'])]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['timeSlot:read','timeSlot:write','reservation:read'])]
    private ?float $price = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d'])] //"Format: YYYY-MM-DD "
    #[Groups(['timeSlot:read','timeSlot:write','opening_time:read','reservation:read'])]
    #[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, strategy: 'exact')]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['timeSlot:read','timeSlot:write','opening_time:read'])]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $isAvailable = null;

    #[ORM\ManyToOne(inversedBy: 'timeSlots')]
    #[Groups(['timeSlot:read','timeSlot:write','opening_time:read'])]
    private ?OpeningTime $openingTime = null;

    #[ORM\ManyToOne(inversedBy: 'timeSlots')]
    #[Groups(['timeSlot:read','timeSlot:write','opening_time:read'])]
    private ?Reservation $reservation = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['timeSlot:read','timeSlot:write','opening_time:read'])]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $isOutdated = null;

    #[ORM\ManyToOne(inversedBy: 'timeSlots')]
    #[Groups(['timeSlot:read','timeSlot:write','opening_time:read'])]
    #[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, strategy: 'exact')]
    private ?Pitch $pitch = null;



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

    public function getIsAvailable(): ?bool
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

    public function getReservation(): ?Reservation
    {
        return $this->reservation;
    }

    public function setReservation(?Reservation $reservation): self
    {
        $this->reservation = $reservation;

        return $this;
    }

    public function getIsOutdated(): ?bool
    {
        return $this->isOutdated;
    }

    public function setIsOutdated(?bool $isOutdated): self
    {
        $this->isOutdated = $isOutdated;

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
