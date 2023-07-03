<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\FeedbackRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FeedbackRepository::class)]
#[ApiResource(
    description: 'Feedback rest endpoint',
    operations: [
        new Get(
            normalizationContext: ['groups' => ['feedback:read','feedback:item:get']]
        ),
        new GetCollection(),
        new Post(
            security: 'is_granted("ROLE_FEEDBACK_CREATE")',
        ),
        new Delete(
            security: 'is_granted("ROLE_ADMIN")',
        )
    ],
    normalizationContext: [
        'groups' => ['feedback:read'],
    ],
    denormalizationContext: [
        'groups' => ['feedback:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],

)]
class Feedback
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['feedback:read','feedback:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['feedback:read','feedback:write'])]
    private ?string $feedbackText = null;

    #[ORM\Column]
    #[Groups(['feedback:read','feedback:write'])]
    private ?int $feedbackStar = null;

    #[ORM\ManyToOne(inversedBy: 'feedback')]
    #[Groups(['feedback:read','feedback:write'])]
    private ?User $owner = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFeedbackText(): ?string
    {
        return $this->feedbackText;
    }

    public function setFeedbackText(string $feedbackText): self
    {
        $this->feedbackText = $feedbackText;

        return $this;
    }

    public function getFeedbackStar(): ?int
    {
        return $this->feedbackStar;
    }

    public function setFeedbackStar(int $feedbackStar): self
    {
        $this->feedbackStar = $feedbackStar;

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
