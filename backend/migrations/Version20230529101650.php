<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230529101650 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE reservation_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE reservation (id INT NOT NULL, total_price DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE reservation_pitch (reservation_id INT NOT NULL, pitch_id INT NOT NULL, PRIMARY KEY(reservation_id, pitch_id))');
        $this->addSql('CREATE INDEX IDX_64E06E7EB83297E7 ON reservation_pitch (reservation_id)');
        $this->addSql('CREATE INDEX IDX_64E06E7EFEEFC64B ON reservation_pitch (pitch_id)');
        $this->addSql('ALTER TABLE reservation_pitch ADD CONSTRAINT FK_64E06E7EB83297E7 FOREIGN KEY (reservation_id) REFERENCES reservation (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation_pitch ADD CONSTRAINT FK_64E06E7EFEEFC64B FOREIGN KEY (pitch_id) REFERENCES pitch (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE time_slot ADD reservation_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE time_slot ADD CONSTRAINT FK_1B3294AB83297E7 FOREIGN KEY (reservation_id) REFERENCES reservation (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_1B3294AB83297E7 ON time_slot (reservation_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE time_slot DROP CONSTRAINT FK_1B3294AB83297E7');
        $this->addSql('DROP SEQUENCE reservation_id_seq CASCADE');
        $this->addSql('ALTER TABLE reservation_pitch DROP CONSTRAINT FK_64E06E7EB83297E7');
        $this->addSql('ALTER TABLE reservation_pitch DROP CONSTRAINT FK_64E06E7EFEEFC64B');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE reservation_pitch');
        $this->addSql('DROP INDEX IDX_1B3294AB83297E7');
        $this->addSql('ALTER TABLE time_slot DROP reservation_id');
    }
}
