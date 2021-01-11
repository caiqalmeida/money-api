# Class 102
## Aggregate : Unwiding and projecting

Example: We receive a year in query params, and we show the tours that will happen in that year

```javascript
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates'},
          numTourStarts: {$sum: 1},
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: {  month: '$_id'}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ])
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}
```
