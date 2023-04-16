<?php

namespace App\Tests\Functional;

use App\Entity\Pitch;
use App\Factory\PitchFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Browser\HttpOptions;
use Zenstruck\Browser\Test\HasBrowser;
use Zenstruck\Foundry\Test\ResetDatabase;


//KernelTestCase: a class from Symfony that extends TestCase (methods for making assertions about the behavior of the app)
class PitchTestWithoutPatch extends KernelTestCase

{

    use HasBrowser; //activate the browser library
    use ResetDatabase; //automatically makes sure that the database is cleared before each test. So if you have two tests, your second test isn't going to mess up because of some data that the first test added.
    public function testGetCollectionOfPitches(): void {

        PitchFactory::createMany(5);
        $json = $this->browser()
            ->get('/api/grounds')
            ->assertJson() //verifies that the response returned by the server is a valid JSON string.
            ->assertJsonMatches('"hydra:totalItems"', 5) //checks that the JSON response contains a key "hydra:totalItems" with a value of 5.
            ->assertJsonMatches('length("hydra:member")', 5) //checks that the JSON response contains a key "hydra:member" with a value of 5.
            //->dump() //outputs the response for debugging purposes.
            ->json() // retrieve the response of an HTTP request in JSON format.
        ;

        //checking that the /api/grounds endpoint returns a valid JSON response with the correct structure and data.
        //The $this->assertSame() assertion is checking that the keys of the first item in the "hydra:member" array of the JSON response match the expected keys.
        $this->assertSame(array_keys($json->decoded()['hydra:member'][0]), [ //array_keys($json->decoded()['hydra:member'][0]) returns an array of keys from the first item in the hydra:member array.
            '@id',
            '@type',
            'id',
            'name',
            'description',
            'capacity',
            'size',
            'phoneNumber',
            'isPending',
            'createdAt',
            'owner',
            'shortDescription',
            'createdAtAgo',

        ]);
    }


    public function testAuthenticationRoute(): void
    {
        $user = UserFactory::createOne([
            'password' => 'pass',
            'roles' => ['ROLE_USER']
        ]);
        $pitch = PitchFactory::createOne(['owner' => $user]);
        $this->browser()
                ->actingAs($user)
                ->get('/api/grounds/'.$pitch->getId())
                ->assertStatus(200)
                ->assertJson()
                ->dump()
        ;



    }

}