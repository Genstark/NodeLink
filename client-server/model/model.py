import cv2
from ultralytics import YOLO


model = YOLO('model/best.pt')

image_path = 'bottle.jpeg'

image = cv2.imread(image_path)

if image is None:
    print('error: coloud not load image at',image_path)
    exit()

results = model(image_path)

for result in results:
    boxes = result.boxes.xyxy
    scores = result.boxes.conf
    class_id = result.boxes.cls
    
    for box, score, class_id in zip(boxes, scores, class_id):
        xmin, ymin, xmax, ymax = map(int, box)
        label = model.names[int(class_id)]
        print(f'Detected: ----{label}---- with confidence: {score:.2f}')
        
        cv2.rectangle(image, (ymin, ymin), (xmax, ymax), (0, 255, 0), 2)
        cv2.putText(image, f'{label} {score:.2f}', (xmin, ymin - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)

resize_image = cv2.resize(image, (500, 500))

cv2.imshow("Detection", resize_image)
cv2.waitKey(0)
cv2.destroyAllWindows()