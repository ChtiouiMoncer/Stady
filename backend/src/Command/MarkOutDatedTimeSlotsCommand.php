<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use App\EventSubscriber\PitchEventListener;

#[AsCommand(
    name: 'MarkOutDatedTimeSlots',
    description: 'set isOutdated to true for TimeSlots whose end times have passed',
)]
class MarkOutDatedTimeSlotsCommand extends Command
{
    private $pitchEventListener;


    protected function configure(): void
    {
        $this
            ->setName('app:mark-outdated-timeslots')
            ->setDescription('set isOutdated to true for TimeSlots whose end times have passed');
        ;
    }

    public function __construct(PitchEventListener $pitchEventListener)
    {
        $this->pitchEventListener = $pitchEventListener;
        parent::__construct();
    }


    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Calls the service method to generate timeslots for all approved pitches
        $this->pitchEventListener->markOutdatedTimeSlots();

        $output->writeln('Timeslots marked Outdated successfully!');

        return Command::SUCCESS;
    }
}
