import cv2


class VideoProcessingService:
    @staticmethod
    def extract_frames(video_path, num_frames=10):
        frames = []
        video = cv2.VideoCapture(video_path)
        video_frames_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        skip_frames_window = max(int(video_frames_count / num_frames), 1)
        for frame_counter in range(num_frames):
            video.set(cv2.CAP_PROP_POS_FRAMES, frame_counter * skip_frames_window)
            success, frame = video.read()
            if not success:
                break
            frames.append(frame)
        video.release()
        return frames
