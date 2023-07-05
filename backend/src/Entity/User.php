<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
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
use App\Repository\UserRepository;
use App\State\UserPasswordHasher;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;




#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource(
    operations: [
        new Get(
            security: 'is_granted("ROLE_USER_EDIT") and object == user',
        ),
        new GetCollection(
            security: 'is_granted("ROLE_ADMIN")'
        ),
        new Post(
            security: 'is_granted("PUBLIC_ACCESS")',
            processor: UserPasswordHasher::class
        ),
        new Put(
            security: 'is_granted("ROLE_USER_EDIT") and object == user',
            processor: UserPasswordHasher::class),
        new Patch(
            security: 'is_granted("ROLE_USER_EDIT") and object == user',
            processor: UserPasswordHasher::class),
        new Delete(
            security: 'is_granted("ROLE_USER_EDIT") and object == user',
        )
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
    paginationItemsPerPage: 100,
)
]
#[UniqueEntity(fields: ['email'],message: 'There is already an account with this email')]
#[UniqueEntity(fields: ['username'],message: 'There is already an account with this username')]
#[ApiFilter(PropertyFilter::class)]
#[ApiFilter(SearchFilter::class, properties: ["pitches.name" => 'partial'] )]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read','reservation:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user:read', 'user:write','reservation:read'])]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Groups(['user:read', 'user:write'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?string $password = null;

    //#[Assert\NotBlank]
    #[Groups(['user:write'])]
    private ?string $plainPassword = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user:read', 'user:write','ground:item:get','ground:write', 'ground:read','reservation:read','review:read','feedback:read'])]
    #[Assert\NotBlank]
    private ?string $username = null;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Pitch::class, cascade: ['persist'],  orphanRemoval: true)]
    #[Groups(['user:read','user:write'])]
    #[Assert\Valid]
    #[ApiProperty(
        security: 'is_granted("ROLE_OWNER") or is_granted("ROLE_ADMIN") and object == user',
    )]
    private Collection $pitches;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Review::class, cascade: ['persist'],  orphanRemoval: true)]
    #[Groups(['user:read','user:write'])]
    #[Assert\Valid]
    #[ApiProperty(
        security: 'is_granted("ROLE_MEMBER") or is_granted("ROLE_ADMIN") and object == user',
    )]
    private Collection $reviews;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Reservation::class)]
    #[Groups(['user:read','user:write'])]
    #[Assert\Valid]
    private Collection $reservations;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Feedback::class)]
    #[Groups(['user:read','user:write'])]
    #[Assert\Valid]
    #[ApiProperty(
        security: 'is_granted("ROLE_MEMBER") or is_granted("ROLE_ADMIN") and object == user',
    )]
    private Collection $feedback;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read','user:write'])]
    private ?string $phoneNumber = null;




    public function __construct()
    {
        $this->pitches = new ArrayCollection();
        $this->reservations = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->feedback = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    /* public function setId(int $id): self
     {
        $this->id = $id;
        return $this;
     }*/

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        //$roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @return Collection<int, Pitch>
     */
    public function getPitches(): Collection
    {
        return $this->pitches;
    }


    public function addPitch(Pitch $pitch): self
    {
        if (!$this->pitches->contains($pitch)) {
            $this->pitches->add($pitch);
            $pitch->setOwner($this);
        }

        return $this;
    }

    public function removePitch(Pitch $pitch): self
    {
        if ($this->pitches->removeElement($pitch)) {
            // set the owning side to null (unless already changed)
            if ($pitch->getOwner() === $this) {
                $pitch->setOwner(null);
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
            $review->setOwner($this);
        }

        return $this;
    }

    public function removeReview(Review $review): self
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getOwner() === $this) {
                $review->setOwner(null);
            }
        }

        return $this;
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
            $reservation->setOwner($this);
        }

        return $this;
    }

    public function removeReservation(Reservation $reservation): self
    {
        if ($this->reservations->removeElement($reservation)) {
            // set the owning side to null (unless already changed)
            if ($reservation->getOwner() === $this) {
                $reservation->setOwner(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Feedback>
     */
    public function getFeedback(): Collection
    {
        return $this->feedback;
    }

    public function addFeedback(Feedback $feedback): self
    {
        if (!$this->feedback->contains($feedback)) {
            $this->feedback->add($feedback);
            $feedback->setOwner($this);
        }

        return $this;
    }

    public function removeFeedback(Feedback $feedback): self
    {
        if ($this->feedback->removeElement($feedback)) {
            // set the owning side to null (unless already changed)
            if ($feedback->getOwner() === $this) {
                $feedback->setOwner(null);
            }
        }

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(?string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }


}
