<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use App\EventSubscriber\PitchEventListener;

#[AsCommand(
    name: 'GenerateTimeSlotDailyCommand',
    description: 'Generates time slots for the date one month ahead for the approved pitches',
)]
class GenerateTimeSlotsCommand extends Command
{
    private $pitchEventListener;

    protected function configure(): void
    {
        $this
            ->setName('app:generate-timeslots')
            ->setDescription('Generates time slots for the date one month ahead');
    }

    public function __construct(PitchEventListener $pitchEventListener)
    {
        $this->pitchEventListener = $pitchEventListener;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Calls the service method to generate timeslots for all approved pitches
        $this->pitchEventListener->generateTimeSlotsForAllApprovedPitches();

        $output->writeln('Daily Time slots generated successfully!');

        return Command::SUCCESS;
    }
}
