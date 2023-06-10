<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230609033121 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE image ADD pitch_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045FFEEFC64B FOREIGN KEY (pitch_id) REFERENCES pitch (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_C53D045FFEEFC64B ON image (pitch_id)');
        $this->addSql('ALTER TABLE review ADD pitch_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C6FEEFC64B FOREIGN KEY (pitch_id) REFERENCES pitch (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_794381C6FEEFC64B ON review (pitch_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C6FEEFC64B');
        $this->addSql('DROP INDEX IDX_794381C6FEEFC64B');
        $this->addSql('ALTER TABLE review DROP pitch_id');
        $this->addSql('ALTER TABLE image DROP CONSTRAINT FK_C53D045FFEEFC64B');
        $this->addSql('DROP INDEX IDX_C53D045FFEEFC64B');
        $this->addSql('ALTER TABLE image DROP pitch_id');
    }
}
