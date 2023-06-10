<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\ReservationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[ORM\HasLifecycleCallbacks()]
#[ApiResource(
    description: 'Reservation rest endpoint',
    operations: [
        new Get(
            normalizationContext: ['groups' => ['reservation:read','reservation:item:get']]
        ),
        new GetCollection(
            security: 'is_granted("ROLE_ADMIN")',
        ),
        new Post(
            security: 'is_granted("ROLE_RESERVATION_CREATE")',
        ),
        new Patch(
            security: 'is_granted("ROLE_RESERVATION_EDIT")',
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN")',
        )
    ],
    normalizationContext: [
        'groups' => ['reservation:read'],
    ],
    denormalizationContext: [
        'groups' => ['reservation:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],

)]
#[ApiResource(
    uriTemplate: '/users/{user_id}/reservations.{_format}', // URI template for the resource collection
    operations: [new GetCollection()], // Allowed operations for the resource

    uriVariables: [ // URI variables for the resource
        'user_id' => new Link(fromProperty: 'reservations', fromClass: User::class) // Link to the User resource using the "pitches" property as the source
    ],
    normalizationContext: [
        'groups' => ['reservation:read'],
    ],
    paginationItemsPerPage: 100,
    security: 'is_granted("ROLE_MEMBER") and user_id == user.getId()',
    extraProperties: [
        'standard_put' => true,
    ],
)]
#[ApiResource(
    uriTemplate: '/grounds/{pitch_id}/reservations.{_format}', // URI template for the resource collection
    operations: [new GetCollection()], // Allowed operations for the resource

    uriVariables: [ // URI variables for the resource
        'pitch_id' => new Link(fromProperty: 'reservations', fromClass: Pitch::class) // Link to the User resource using the "pitches" property as the source
    ],
    normalizationContext: [
        'groups' => ['reservation:read'],
    ],
    paginationItemsPerPage: 100,
    security: 'is_granted("ROLE_OWNER")',
    extraProperties: [
        'standard_put' => true,
    ],
)]
#[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, properties: ["pitch.name" => 'exact'] )]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['reservation:read','reservation:write','ground:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['reservation:read','reservation:write'])]
    private ?float $totalPrice = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[Groups(['reservation:read','reservation:write'])]
    private ?Pitch $pitch = null;

    #[ORM\OneToMany(mappedBy: 'reservation', targetEntity: TimeSlot::class)]
    #[Groups(['reservation:read','reservation:write'])]
    private Collection $timeSlots;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['reservation:read','reservation:write'])]
    private ?User $owner = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['reservation:read','reservation:write'])]
    private ?bool $isCancelled = null;

    public function __construct()
    {
        $this->timeSlots = new ArrayCollection();
        $this->isCancelled = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotalPrice(): ?float
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(float $totalPrice): self
    {
        $this->totalPrice = $totalPrice;

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
            $timeSlot->setReservation($this);
        }

        return $this;
    }

    public function removeTimeSlot(TimeSlot $timeSlot): self
    {
        if ($this->timeSlots->removeElement($timeSlot)) {
            // set the owning side to null (unless already changed)
            if ($timeSlot->getReservation() === $this) {
                $timeSlot->setReservation(null);
            }
        }

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }



    public function getIsCancelled(): ?bool
    {
        return $this->isCancelled;
    }

    public function setIsCancelled(?bool $isCancelled): self
    {
        $this->isCancelled = $isCancelled;

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


    #[ORM\PrePersist]
    public function updateTimeslotsAvailability(): void
    {
        foreach ($this->getTimeSlots() as $timeSlot) {
            if (!$timeSlot->getIsAvailable()) {
                throw new \Exception('Cannot reserve a timeslot that is already Reserved.');
            }
            if ($timeSlot->getIsOutdated()) {
                throw new \Exception('Cannot reserve a timeslot that is outdated.');
            }

            $timeSlot->setIsAvailable(false);
        }
    }

//
}
