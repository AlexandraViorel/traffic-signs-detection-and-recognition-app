from .StatisticsStrategy import StatisticsStrategy


class TrafficSignDetectionStrategy(StatisticsStrategy):
    def calculate(self, detections):
        stats = {}
        for detection in detections:
            date_str = detection.detection_date.strftime("%Y-%m-%d")
            if date_str not in stats:
                stats[date_str] = 0
            stats[date_str] += detection.number_of_signs

        stats_list = [{'detection_date': date, 'number_of_signs': number_of_signs} for date, number_of_signs in stats.items()]
        return stats_list
