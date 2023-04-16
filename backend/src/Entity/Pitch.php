<?php

namespace App\Entity;


use ApiPlatform\Doctrine\Odm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use ApiPlatform\Metadata\Link;
use App\Repository\PitchRepository;
use Carbon\Carbon;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\DocBlock\Tags\Property;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
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
        ),
        new Put(
            security: 'is_granted("ROLE_PITCH_EDIT")',
        ),
        new Patch(
            security: 'is_granted("ROLE_PITCH_EDIT")',
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN")',
        )
    ],
    normalizationContext: [
        'groups' => ['ground:read'],
    ],
    denormalizationContext: [
        'groups' => ['ground:write'],
    ],
    paginationItemsPerPage: 10,
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
    security: 'is_granted("ROLE_OWNER")',
    extraProperties: [
       'standard_put' => true,
   ],


)]


#[ApiFilter(PropertyFilter::class)]
#[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, properties: ["owner.username" => 'partial'] )]


class Pitch
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ground:read','user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['ground:read','ground:write','user:read','user:write'])]
    #[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, strategy: 'partial')]
    #[Assert\NotBlank]
    #[Assert\Length(min:5, max: 50, maxMessage: 'Describe the Name of the Pitch in 50 char max!')]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['ground:read','ground:write','user:read','user:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['ground:read','ground:write','user:read','user:write'])]
    #[ApiFilter(RangeFilter::class)]
    #[Assert\NotBlank]
    #[Assert\GreaterThanOrEqual(2)]
    #[Assert\LessThanOrEqual(100)]
    private ?int $capacity = null;

    /**
     * The size of the pitch in m (ex:100x64m)
     */
    #[ORM\Column(length: 255)]
    #[Groups(['ground:read','ground:write','user:read','user:write'])]
    private ?string $size = null;

    #[ORM\Column(length: 255)]
    #[Groups(['ground:read','ground:write','user:read','user:write'])]
    private ?string $phoneNumber = null;

    #[ORM\Column]
    #[Groups(['ground:read','ground:write','user:read'])]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $isPending = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['ground:read','ground:write','user:read'])]
    private ?bool $isApproved = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['ground:read','ground:write','user:read'])]
    private ?bool $isRejected = null;

    #[ORM\Column]
    #[Groups(['ground:read','user:read'])]
    private ?\DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'pitches')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['ground:read','ground:write'])]
    #[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, strategy: 'exact')]
    #[Assert\Valid]
    private ?User $owner = null;


    public function __construct(string $name = null)
    {
        $this->name = $name;
        $this->createdAt = new \DateTimeImmutable();

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


}
