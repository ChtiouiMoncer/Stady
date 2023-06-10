<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\OpeningTimeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;

#[ORM\Entity(repositoryClass: OpeningTimeRepository::class)]
#[ApiResource
(
    description: 'OpeningTime rest endpoint',
    operations: [
        new Get(
            normalizationContext: ['groups' => ['opening_time:read','opening_time:item:get']]

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
        'groups' => ['opening_time:read'],
    ],
    denormalizationContext: [
        'groups' => ['opening_time:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],
)]
#[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, properties: ["pitch.name" => 'partial'] )]

class OpeningTime
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['opening_time:read','ground:read','ground:write'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 10)]
    #[Groups(['opening_time:read','opening_time:write','ground:read','ground:write'])]
    private ?string $day = null;
    #[ORM\Column(type: Types::TIME_MUTABLE, nullable: true)]
    #[Groups(['opening_time:read','opening_time:write','ground:read','ground:write'])]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'H:i:s'])] //"Format: HH:MM:SS"
    private ?\DateTimeInterface $openTime = null;

    #[ORM\Column(type: Types::TIME_MUTABLE, nullable: true)]
    #[Groups(['opening_time:read','opening_time:write','ground:read','ground:write'])]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'H:i:s'])] //"Format: HH:MM:SS"
    private ?\DateTimeInterface $closeTime = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['opening_time:read','opening_time:write','ground:read','ground:write'])]
    private ?bool $isClosed = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['opening_time:read','opening_time:write','ground:read','ground:write'])]
    private ?int $interval = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['opening_time:read','opening_time:write','ground:read','ground:write'])]
    private ?float $price = null;

    #[ORM\ManyToOne(inversedBy: 'openingTimes')]
    #[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, strategy: 'partial')]
    #[Groups(['opening_time:read','opening_time:write','ground:read','ground:write'])]
    private ?Pitch $pitch = null;

    #[ORM\OneToMany(mappedBy: 'openingTime', targetEntity: TimeSlot::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['opening_time:read','opening_time:write','ground:write'])]
    private Collection $timeSlots;

    public function __construct()
    {
        $this->timeSlots = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }


    public function getDay(): ?string
    {
        return $this->day;
    }

    public function setDay(string $day): self
    {
        if (!DayOfWeek::isValid($day)) {
            throw new \InvalidArgumentException("Invalid day of week");
        }

        $this->day = $day;

        return $this;
    }

    public function getOpenTime(): ?\DateTimeInterface
    {
        return $this->openTime;
    }

    public function setOpenTime(?\DateTimeInterface $openTime): self
    {
        $this->openTime = $openTime;

        return $this;
    }

    public function getCloseTime(): ?\DateTimeInterface
    {
        return $this->closeTime;
    }

    public function setCloseTime(?\DateTimeInterface $closeTime): self
    {
        $this->closeTime = $closeTime;

        return $this;
    }

    public function getIsClosed(): ?bool
    {
        return $this->isClosed;
    }

    public function setIsClosed(?bool $isClosed): self
    {
        $this->isClosed = $isClosed;

        return $this;
    }

    public function getInterval(): ?int
    {
        return $this->interval;
    }

    public function setInterval(?int $interval): self
    {
        $this->interval = $interval;

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

    public function getPitch(): ?Pitch
    {
        return $this->pitch;
    }

    public function setPitch(?Pitch $pitch): self
    {
        $this->pitch = $pitch;

        return $this;
    }

    /**
     * @return Collection<int, TimeSlot>
     */
    public function getTimeSlots(): Collection
    {
        return $this->timeSlots;
    }

    public function addTimeSlot(TimeSlot $timeSlot): self
    {
        if (!$this->timeSlots->contains($timeSlot)) {
            $this->timeSlots->add($timeSlot);
            $timeSlot->setOpeningTime($this);
        }

        return $this;
    }

    public function removeTimeSlot(TimeSlot $timeSlot): self
    {
        if ($this->timeSlots->removeElement($timeSlot)) {
            // set the owning side to null (unless already changed)
            if ($timeSlot->getOpeningTime() === $this) {
                $timeSlot->setOpeningTime(null);
            }
        }

        return $this;
    }

}
