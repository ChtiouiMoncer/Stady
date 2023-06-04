<?php

namespace App\Repository;

use App\Entity\TimeSlot;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TimeSlot>
 *
 * @method TimeSlot|null find($id, $lockMode = null, $lockVersion = null)
 * @method TimeSlot|null findOneBy(array $criteria, array $orderBy = null)
 * @method TimeSlot[]    findAll()
 * @method TimeSlot[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TimeSlotRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TimeSlot::class);
    }

    public function save(TimeSlot $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(TimeSlot $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findByStartTimeBeforeAndIsOutdated(bool $isOutdated, \DateTimeInterface $datetime)
    {
        // Create a QueryBuilder instance
        // QueryBuilder is a Doctrine tool to create DQL (Doctrine Query Language) queries
        // 't' is an alias that will represent TimeSlot entities in the query
        $qb = $this->createQueryBuilder('t');

        // Construct a WHERE clause for the DQL query
        // CONCAT(t.date, ' ', t.endTime) combines the date and end time fields into a single string
        // lte is a Doctrine function that stands for 'less than or equals to'
        // The whole clause basically means: "where the combined date and start time is less than or equals to the given datetime"
        $qb->where($qb->expr()->lte('CONCAT(t.date, \' \', t.startTime)', ':datetime'))



            // Add another condition to the WHERE clause
            // This condition means "and where the isOutdated field is equals to the given isOutdated value"
            ->andWhere('t.isOutdated = :isOutdated')

            // Bind the provided datetime to the ':datetime' parameter in the query
            // format() converts the datetime into a string in the 'Y-m-d H:i:s' format (e.g., '2021-12-31 23:59:59')
            ->setParameter('datetime', $datetime->format('Y-m-d H:i:s'))

            // Bind the provided isOutdated value to the ':isOutdated' parameter in the query
            ->setParameter('isOutdated', $isOutdated);

        // Execute the DQL query and get the results
        // getResult() returns an array of TimeSlot entities that match the conditions
        return $qb->getQuery()->getResult();
    }


//    /**
//     * @return TimeSlot[] Returns an array of TimeSlot objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?TimeSlot
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
