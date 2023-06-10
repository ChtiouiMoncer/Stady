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

        $qb = $this->createQueryBuilder('t');
        $qb->where($qb->expr()->lte('CONCAT(t.date, \' \', t.startTime)', ':datetime'))
            ->andWhere('t.isOutdated = :isOutdated')
            // format() converts the datetime into a string in the 'Y-m-d H:i:s' format (e.g., '2021-12-31 23:59:59')
            ->setParameter('datetime', $datetime->format('Y-m-d H:i:s'))
            // Bind the provided isOutdated value to the ':isOutdated' parameter in the query
            ->setParameter('isOutdated', $isOutdated);
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
