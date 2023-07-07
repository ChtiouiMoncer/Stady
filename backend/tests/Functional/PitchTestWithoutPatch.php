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

        //PitchFactory::createMany(5);
        $json = $this->browser()
            ->get('/api/grounds')
            ->assertJson() //verifies that the response returned by the server is a valid JSON string.

            //->dump() //outputs the response for debugging purposes.
            ->json() // retrieve the response of an HTTP request in JSON format.
        ;

        //checking that the /api/grounds endpoint returns a valid JSON response with the correct structure and data.
        //The $this->assertSame() assertion is checking that the keys of the first item in the "hydra:member" array of the JSON response match the expected keys.

    }


    public function testAuthenticationRoute(): void
    {
        $user = UserFactory::createOne([
            'password' => 'pass',
            'roles' => ['ROLE_ADMIN']
        ]);
        $this->browser()
                ->actingAs($user)
                ->get('/api/users')
                ->assertStatus(200)
                ->assertJson()
                ->dump()
        ;



    }


    public function testAuthenticationRoute2(): void
    {
        $user = UserFactory::createOne([
            'password' => 'pass',
            'roles' => ['ROLE_ADMIN']
        ]);
        $this->browser()
            ->actingAs($user)
            ->get('/api/reservations')
            ->assertStatus(200)
            ->assertJson()
            ->dump()
        ;


    }

}