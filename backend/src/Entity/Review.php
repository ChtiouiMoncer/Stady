<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ReviewRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReviewRepository::class)]
#[ApiResource]
class Review
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $reviewText = null;

    #[ORM\Column(nullable: true)]
    private ?int $reviewStar = null;

    #[ORM\ManyToOne(inversedBy: 'reviews')]
    private ?User $owner = null;

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
}
