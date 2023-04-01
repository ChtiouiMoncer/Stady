<?php

namespace App\Factory;

use App\Entity\Pitch;
use App\Repository\PitchRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Pitch>
 *
 * @method        Pitch|Proxy create(array|callable $attributes = [])
 * @method static Pitch|Proxy createOne(array $attributes = [])
 * @method static Pitch|Proxy find(object|array|mixed $criteria)
 * @method static Pitch|Proxy findOrCreate(array $attributes)
 * @method static Pitch|Proxy first(string $sortedField = 'id')
 * @method static Pitch|Proxy last(string $sortedField = 'id')
 * @method static Pitch|Proxy random(array $attributes = [])
 * @method static Pitch|Proxy randomOrCreate(array $attributes = [])
 * @method static PitchRepository|RepositoryProxy repository()
 * @method static Pitch[]|Proxy[] all()
 * @method static Pitch[]|Proxy[] createMany(int $number, array|callable $attributes = [])
 * @method static Pitch[]|Proxy[] createSequence(array|callable $sequence)
 * @method static Pitch[]|Proxy[] findBy(array $attributes)
 * @method static Pitch[]|Proxy[] randomRange(int $min, int $max, array $attributes = [])
 * @method static Pitch[]|Proxy[] randomSet(int $number, array $attributes = [])
 */
final class PitchFactory extends ModelFactory
{    private const PITCHES_NAMES = ['pile of gold coins', 'diamond-encrusted throne', 'rare magic staff', 'enchanted sword', 'set of intricately crafted goblets', 'collection of ancient tomes', 'hoard of shiny gemstones', 'chest filled with priceless works of art', 'giant pearl', 'crown made of pure platinum', 'giant egg (possibly a dragon egg?)', 'set of ornate armor', 'set of golden utensils', 'statue carved from a single block of marble', 'collection of rare, antique weapons', 'box of rare, exotic chocolates', 'set of ornate jewelry', 'set of rare, antique books', 'giant ball of yarn', 'life-sized statue of the dragon itself', 'collection of old, used toothbrushes', 'box of mismatched socks', 'set of outdated electronics (such as CRT TVs or floppy disks)', 'giant jar of pickles', 'collection of novelty mugs with silly sayings', 'pile of old board games', 'giant slinky', 'collection of rare, exotic hats'];

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function getDefaults(): array
    {
        return [
            'capacity' => self::faker()->randomNumber(2, true, 50),
            'createdAt' => new \DateTimeImmutable(),
            //'createdAt' => \DateTimeImmutable::createFromMutable(self::faker()->dateTimeBetween('-1 year')),
            'description' => self::faker()->text(20),
            'isPending' => self::faker()->boolean(),
            'name' => self::faker()->randomElement(self::PITCHES_NAMES),
            'phoneNumber' => self::faker()->randomNumber(8),
            'size' => self::faker()->text(10),
            'owner' => UserFactory::new(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): self
    {
        return $this
            // ->afterInstantiate(function(Pitch $pitch): void {})
        ;
    }

    protected static function getClass(): string
    {
        return Pitch::class;
    }
}
