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
use App\Repository\ReviewRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: ReviewRepository::class)]
#[ApiResource(
    description: 'Review rest endpoint',
    operations: [
        new Get(
            normalizationContext: ['groups' => ['review:read','review:item:get']]
        ),
        new GetCollection(),
        new Post(
            security: 'is_granted("ROLE_REVIEW_CREATE")',
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN")',
        )
    ],
    normalizationContext: [
        'groups' => ['review:read'],
    ],
    denormalizationContext: [
        'groups' => ['review:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],

)]
#[ApiResource(
    uriTemplate: '/users/{user_id}/reviews.{_format}', // URI template for the resource collection
    operations: [new GetCollection()], // Allowed operations for the resource

    uriVariables: [ // URI variables for the resource
        'user_id' => new Link(fromProperty: 'reviews', fromClass: User::class) // Link to the User resource using the "pitches" property as the source
    ],
    normalizationContext: [
        'groups' => ['review:read'],
    ],
    paginationItemsPerPage: 100,
    security: 'is_granted("ROLE_MEMBER") and user_id == user.getId()',
    extraProperties: [
        'standard_put' => true,
    ],
)]
#[ApiResource(
    uriTemplate: '/grounds/{pitch_id}/reviews.{_format}', // URI template for the resource collection
    operations: [new GetCollection()], // Allowed operations for the resource

    uriVariables: [ // URI variables for the resource
        'pitch_id' => new Link(fromProperty: 'reviews', fromClass: Pitch::class) // Link to the User resource using the "pitches" property as the source
    ],
    normalizationContext: [
        'groups' => ['review:read'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],
)]
#[ApiFilter(\ApiPlatform\Doctrine\Orm\Filter\SearchFilter::class, properties: ["pitch.name" => 'exact'] )]
class Review
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['review:read','review:write','ground:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['review:read','review:write'])]
    private ?string $reviewText = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['review:read','review:write','ground:read'])]
    #[Assert\GreaterThanOrEqual(0)]
    #[Assert\LessThanOrEqual(5)]
    private ?int $reviewStar = null;

    #[ORM\ManyToOne(inversedBy: 'reviews')]
    #[Groups(['review:read','review:write'])]
    private ?User $owner = null;

    #[ORM\ManyToOne(inversedBy: 'reviews')]
    #[Groups(['review:read','review:write'])]
    private ?Pitch $pitch = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReviewText(): ?string
    {
        return $this->reviewText;
    }

    public function setReviewText(?string $reviewText): self
    {
        $this->reviewText = $reviewText;

        return $this;
    }

    public function getReviewStar(): ?int
    {
        return $this->reviewStar;
    }

    public function setReviewStar(?int $reviewStar): self
    {
        $this->reviewStar = $reviewStar;

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
