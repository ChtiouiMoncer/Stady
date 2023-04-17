<?php

namespace App\Tests\Functional;

use App\Entity\User;
use App\Factory\PitchFactory;
use App\Factory\UserFactory;
use Zenstruck\Browser\HttpOptions;
use Zenstruck\Foundry\Test\ResetDatabase;


//KernelTestCase: a class from Symfony that extends TestCase (methods for making assertions about the behavior of the app)
class PitchTest extends ApiTestCase

{

    //use HasBrowser; //activate the browser library
    use ResetDatabase; //automatically makes sure that the database is cleared before each test. So if you have two tests, your second test isn't going to mess up because of some data that the first test added.


    public function testPatchToUpdatePitch()
    {
        $user = UserFactory::createOne([
            'password' => 'pass',
            'roles' => ['ROLE_OWNER']
        ]);
        $pitch = PitchFactory::createOne(['owner' => $user]);

        $user2 = UserFactory::createOne([
            'password' => 'pass',
            'roles' => ['ROLE_OWNER']
        ]);

//        $this->browser()
//            ->actingAs($user)
//            ->patch('/api/grounds/'.$pitch->getId(), [
//                'json' => [
//                    'capacity' => 100,
//                ],
//            ])
//           // ->assertStatus(200)
//            //->dump()
//           ->assertJsonMatches('capacity', 100)
//        ;
//
       /* $this->browser()
            ->actingAs($user2)
            ->patch('/api/grounds/'.$pitch->getId(), [
                'json' => [
                    'capacity' =>90,
                ],
            ])
            ->assertStatus(403)
            //->dump()
            ->assertJsonMatches('capacity', 90)
            ;

        $this->browser()
            ->actingAs($user)
            ->patch('/api/grounds/'.$pitch->getId(), [
                'json' => [
                    'owner' =>'api/users/'.$user2->getId(),
                ],
            ])
            ->assertStatus(403)
            //->dump()
            ->assertJsonMatches('capacity', 90)
        ;*/
    }


    public function testAdminCanPatchToEditPitch(){
        //$admin = UserFactory::createOne(['roles' => 'ROLE_ADMIN']);
        //$admin = UserFactory::new()->withRoles(['ROLE_ADMIN'])->create();
        $admin = UserFactory::new()->asAdmin()->create();

        $pitch = PitchFactory::createOne();

        $this->browser()
            ->actingAs($admin)
            ->patch('/api/grounds/'. $pitch->getId(),[
                'json' => [
                    'capacity' => 20
                ],
            ])
            ->assertStatus(200)
            ->assertJsonMatches('capacity', 20);


    }



}