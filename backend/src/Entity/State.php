<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\StateRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: StateRepository::class)]
#[ApiResource
(
    description: 'State rest endpoint',
    operations: [
        new Get(
            normalizationContext: ['groups' => ['state:read','state:item:get']]
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
        'groups' => ['state:read'],
    ],
    denormalizationContext: [
        'groups' => ['state:write'],
    ],
    paginationItemsPerPage: 100,
    extraProperties: [
        'standard_put' => true,
    ],
)]
class State
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['state:read','state:write','ground:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    #[Groups(['state:read','state:write','ground:read','ground:item:get'])]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'state', targetEntity: Pitch::class, orphanRemoval: true)]
    private Collection $pitches;

    public function __construct()
    {
        $this->pitches = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

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
            $pitch->setState($this);
        }

        return $this;
    }

    public function removePitch(Pitch $pitch): self
    {
        if ($this->pitches->removeElement($pitch)) {
            // set the owning side to null (unless already changed)
            if ($pitch->getState() === $this) {
                $pitch->setState(null);
            }
        }

        return $this;
    }
}
