import picamera

# with picamera.PiCamera() as camera:
camera = PiCamera()
camera.resolution = (1024, 768)
camera.hflip = (True)
camera.vflip = (True)
camera.shutter_speed = 800
camera.capture('/home/pi/testimg.jpg')

