<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ClearInvalidTokensCommand',
    description: 'Clears invalid refresh tokens from the database',
)]
class ClearInvalidTokensCommand extends Command
{
    protected function configure(): void
    {
        $this
            ->setName('app:clear-invalid-tokens')
            ->setDescription('Clears invalid refresh tokens from the database');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // Run the gesdinet:jwt:clear command here

        // Find the "gesdinet:jwt:clear" command within the application
        $command = $this->getApplication()->find('gesdinet:jwt:clear');

        // Prepare the arguments for the command
        $arguments = ['command' => 'gesdinet:jwt:clear'];

        // Create an input instance using the arguments
        $input = new ArrayInput($arguments);

        // Run the command with the specified input and output
        $returnCode = $command->run($input, $output);

        // Return the return code from the executed command
        return $returnCode;
    }
}
