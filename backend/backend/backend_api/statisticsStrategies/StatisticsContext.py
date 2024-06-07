class StatisticsContext:
    def __init__(self, strategy):
        self._strategy = strategy

    def set_strategy(self, strategy):
        self._strategy = strategy

    def calculate_statistics(self, detections):
        return self._strategy.calculate(detections)
