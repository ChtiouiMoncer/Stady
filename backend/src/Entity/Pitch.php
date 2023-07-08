<?php

namespace App\Entity;


use ApiPlatform\Doctrine\Odm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use ApiPlatform\Metadata\Link;
use App\Controller\PitchDeleteController;
use App\Repository\PitchRepository;
use App\Validator\MatchingFloorType;
use Carbon\Carbon;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\DocBlock\Tags\Property;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\NotBlank;
use function Symfony\Component\String\u;


#[ORM\Entity(repositoryClass: PitchRepository::class)]
#[ApiResource(
    shortName: 'Ground',
    description: 'Pitch rest endpoint',
    operations: [
        new Get(
            normalizationContext: ['groups' => ['ground:read','ground:item:get']]
        ),
        new GetCollection(),
        new Post(
            security: 'is_granted("ROLE_PITCH_CREATE")',
            securityPostDenormalize: 'is_granted("ROLE_PITCH_CREATE") and object.getOwner() == user'
        ),
        new Patch(
            security: 'is_granted("ROLE_ADMIN") or is_granted("ROLE_PITCH_EDIT") and object.getOwner() == user',
            securityPostDenormalize: 'is_granted("ROLE_ADMIN") or object.getOwner() == user'
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN") or is_granted("ROLE_PITCH_EDIT") and object.getOwner() == user',

        )
    ],
    normalizationContext: [
        'groups' => ['ground:read'],
    ],
    denormalizationContext: [
        'groups' => ['ground:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],

)]
#[ApiResource(

    uriTemplate: '/users/{user_id}/grounds.{_format}', // URI template for the resource collection
    shortName: 'Ground', //short name for the class 'Pitch'
    operations: [new GetCollection()], // Allowed operations for the resource

    uriVariables: [ // URI variables for the resource
        'user_id' => new Link(fromProperty: 'pitches', fromClass: User::class) // Link to the User resource using the "pitches" property as the source
    ],
    normalizationContext: [
        'groups' => ['ground:read'],
    ],
    paginationItemsPerPage: 100,
    security: 'is_granted("ROLE_OWNER") and user_id == user.getId()',
    extraProperties: [
       'standard_put' => true,
   ],
)]
#[UniqueEntity(fields: ['name'],message: 'There is already a pitch with this name')]
#[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, properties: [
    "owner.username" => 'partial',
    "sportsType.SportsName" => 'partial',
    "state.name" => 'partial',

])]



class Pitch
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ground:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['ground:read','ground:write','timeSlot:read','opening_time:read','timeSlot:item:get,opening_time:item:get','review:read','review:item:get','reservation:read','reservation:item:get','state:read','state:item:get'])]
    #[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, strategy: 'partial')]
    #[Assert\NotBlank]
    #[Assert\Length(min:5, max: 50, maxMessage: 'Describe the Name of the Pitch in 50 word max!')]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['ground:read','ground:write'])]
    #[Assert\NotBlank]
    #[Assert\Length(min:5, max: 200, maxMessage: 'Describe  the Pitch in 200 word max!')]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['ground:read','ground:write'])]
    #[ApiFilter(RangeFilter::class)]
    #[Assert\NotBlank]
    #[Assert\GreaterThanOrEqual(2)]
    #[Assert\LessThanOrEqual(100)]
    private ?int $capacity = null;

    /**
     * The size of the pitch in m (ex:100x64m)
     */
    #[ORM\Column(length: 255)]
    #[Groups(['ground:read','ground:write'])]
    #[Assert\NotBlank]
    private ?string $size = null;

    #[ORM\Column(length: 255)]
    #[Groups(['ground:read','ground:write'])]
    #[Assert\NotBlank]
    private ?string $phoneNumber = null;

    #[ORM\Column(nullable: true)]
    #[ApiFilter(BooleanFilter::class)]
    #[Groups(['ground:read','ground:write'])]
    #[ApiProperty(
        securityPostDenormalize: "is_granted('ROLE_ADMIN')",
    )]
    private ?bool $isPending = null;

    #[ORM\Column(nullable: true)]
    #[ApiFilter(BooleanFilter::class)]
    #[Groups(['ground:read','ground:write'])]
    #[ApiProperty(
        securityPostDenormalize: "is_granted('ROLE_ADMIN')",
    )]
    private ?bool $isApproved = null;

    #[ORM\Column(nullable: true)]
    #[ApiFilter(BooleanFilter::class)]
    #[Groups(['ground:read','ground:write'])]
    #[ApiProperty(
        securityPostDenormalize: "is_granted('ROLE_ADMIN')",
    )]
    private ?bool $isRejected = null;

    #[ORM\Column]
    #[Groups(['ground:read'])]
    #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d H:i:s'])] //"Format: YYYY-MM-DD HH:MM:SS"
    private ?\DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'pitches')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['ground:read','ground:write','reservation:read','reservation:item:get'])]
    #[ApiProperty(
        security: 'is_granted("ROLE_OWNER") or is_granted("ROLE_ADMIN") and object == user',
    )]
    #[Assert\Valid]
    private ?User $owner = null;


    #[ORM\OneToOne(mappedBy: 'pitch', cascade: ['persist', 'remove'])]
    #[Groups(['ground:read','ground:write'])]
    #[Assert\Valid]
    private ?Address $address = null;

    #[ORM\OneToOne(mappedBy: 'pitch', cascade: ['persist', 'remove'])]
    #[Groups(['ground:read','ground:write'])]
    #[Assert\Valid]
    private ?Amenties $amenties = null;

    #[ORM\ManyToOne(inversedBy: 'pitch')]
    #[Groups(['ground:read','ground:write'])]
    #[Assert\Valid]
    #[Assert\NotBlank]
    private ?SportsType $sportsType = null;

    #[ORM\ManyToOne]
    #[Groups(['ground:read','ground:write'])]
    #[Assert\Valid]
    #[Assert\NotBlank]
    private ?FloorType $floorType = null;

    #[ORM\OneToMany(mappedBy: 'pitch', targetEntity: OpeningTime::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['ground:read','ground:write'])]
    #[Assert\Valid]
    private Collection $openingTimes;

    #[ORM\OneToMany(mappedBy: 'pitch', targetEntity: Reservation::class, orphanRemoval: true)]
    #[Groups(['ground:write','ground:read'])]
    private Collection $reservations;

    #[ORM\OneToMany(mappedBy: 'pitch', targetEntity: Image::class, cascade: ['persist', 'remove'])]
    #[Groups(['ground:read','ground:write'])]
    private Collection $images;

    #[ORM\OneToMany(mappedBy: 'pitch', targetEntity: Review::class, cascade: ['persist', 'remove'])]
    #[Groups(['ground:read','ground:write'])]
    private Collection $reviews;

    #[ORM\OneToMany(mappedBy: 'pitch', targetEntity: TimeSlot::class, cascade: ['persist', 'remove'])]
    #[Groups(['ground:write'])]
    private Collection $timeSlots;

    #[ORM\ManyToOne(inversedBy: 'pitches')]
    #[Groups(['ground:read','ground:write'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?State $state = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['ground:read','ground:write'])]
    #[ApiProperty(
        securityPostDenormalize: 'is_granted("ROLE_OWNER") or is_granted("ROLE_ADMIN")',
    )]
    private ?bool $isPaused = null;


    public function __construct(string $name = null)
    {
        $this->name = $name;
        $this->createdAt = new \DateTimeImmutable();
        $this->openingTimes = new ArrayCollection();
        $this->isPending = true; // Set $isPending to true by default
        $this->isApproved = false;
        $this->isRejected = false;
        $this->isPaused = false;
        $this->reservations = new ArrayCollection();
        $this->images = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->timeSlots = new ArrayCollection();



    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     */
    public function setName(?string $name): void
    {
        $this->name = $name;
    }



    public function getDescription(): ?string
    {
        return $this->description;
    }

    #[Groups(['ground:read'])]
    public function getShortDescription(): ?string
    {
        return u($this->description)->truncate(40, '...');
    }



    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    #[Groups('ground:write')]
    #[SerializedName('description')]
    public function setTextDescription(string $description): self
    {
        $this->description = nl2br($description);

        return $this;
    }

    public function getCapacity(): ?int
    {
        return $this->capacity;
    }

    public function setCapacity(int $capacity): self
    {
        $this->capacity = $capacity;

        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(string $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    public function getIsPending(): ?bool
    {
        return $this->isPending;
    }

    public function setIsPending(bool $isPending): self
    {
        $this->isPending = $isPending;

        return $this;
    }

    public function getIsApproved(): ?bool
    {
        return $this->isApproved;
    }

    public function setIsApproved(?bool $isApproved): self
    {
        $this->isApproved = $isApproved;

        return $this;
    }

    public function getIsRejected(): ?bool
    {
        return $this->isRejected;
    }

    public function setIsRejected(?bool $isRejected): self
    {
        $this->isRejected = $isRejected;

        return $this;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
         $this->createdAt = $createdAt;
        return $this;

    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    /**
     * A human-readable representation of when this pitch was created.
     */
    #[Groups('ground:read')]

    public function getCreatedAtAgo(): string

    {

        return Carbon::instance($this->createdAt)->diffForHumans();
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

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(Address $address): self
    {
        // set the owning side of the relation if necessary
        if ($address->getPitch() !== $this) {
            $address->setPitch($this);
        }

        $this->address = $address;

        return $this;
    }

    public function getAmenties(): ?Amenties
    {
        return $this->amenties;
    }

    public function setAmenties(Amenties $amenties): self
    {
        // set the owning side of the relation if necessary
        if ($amenties->getPitch() !== $this) {
            $amenties->setPitch($this);
        }

        $this->amenties = $amenties;

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

    /**
     * @return Collection<int, OpeningTime>
     */
    public function getOpeningTimes(): Collection
    {
        return $this->openingTimes;
    }

    public function addOpeningTime(OpeningTime $openingTime): self
    {
        if (!$this->openingTimes->contains($openingTime)) {
            $this->openingTimes->add($openingTime);
            $openingTime->setPitch($this);
        }

        return $this;
    }

    public function removeOpeningTime(OpeningTime $openingTime): self
    {
        if ($this->openingTimes->removeElement($openingTime)) {
            // set the owning side to null (unless already changed)
            if ($openingTime->getPitch() === $this) {
                $openingTime->setPitch(null);
            }
        }

        return $this;
    }

    public function getFloorType(): ?FloorType
    {
        return $this->floorType;
    }

    public function setFloorType(?FloorType $floorType): self
    {
        $this->floorType = $floorType;

        return $this;
    }

    /**
     * @Assert\IsTrue(message="The chosen floor type is not valid for the sport type.")
     */
    public function isFloorTypeValidForSportsType(): bool
    {
        return $this->getFloorType()->getSportsType() === $this->getSportsType();
    }

    /**
     * @return Collection<int, Reservation>
     */
    public function getReservations(): Collection
    {
        return $this->reservations;
    }

    public function addReservation(Reservation $reservation): self
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations->add($reservation);
            $reservation->addPitch($this);
        }

        return $this;
    }

    public function removeReservation(Reservation $reservation): self
    {
        if ($this->reservations->removeElement($reservation)) {
            $reservation->removePitch($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setPitch($this);
        }

        return $this;
    }

    public function removeImage(image $image): self
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getPitch() === $this) {
                $image->setPitch(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): self
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setPitch($this);
        }

        return $this;
    }

    public function removeReview(Review $review): self
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getPitch() === $this) {
                $review->setPitch(null);
            }
        }

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
            $timeSlot->setPitch($this);
        }

        return $this;
    }

    public function removeTimeSlot(TimeSlot $timeSlot): self
    {
        if ($this->timeSlots->removeElement($timeSlot)) {
            // set the owning side to null (unless already changed)
            if ($timeSlot->getPitch() === $this) {
                $timeSlot->setPitch(null);
            }
        }

        return $this;
    }

    public function getState(): ?State
    {
        return $this->state;
    }

    public function setState(?State $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function isIsPaused(): ?bool
    {
        return $this->isPaused;
    }

    public function setIsPaused(?bool $isPaused): self
    {
        $this->isPaused = $isPaused;

        return $this;
    }


}
