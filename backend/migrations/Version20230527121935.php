<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230527121935 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE time_slot ADD reservation_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE time_slot ADD CONSTRAINT FK_1B3294AB83297E7 FOREIGN KEY (reservation_id) REFERENCES reservation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_1B3294AB83297E7 ON time_slot (reservation_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE time_slot DROP CONSTRAINT FK_1B3294AB83297E7');
        $this->addSql('DROP INDEX IDX_1B3294AB83297E7');
        $this->addSql('ALTER TABLE time_slot DROP reservation_id');
    }
}
