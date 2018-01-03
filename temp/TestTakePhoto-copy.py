#!/usr/bin/env python
# import RPi.GPIO as GPIO
# import time
import picamera
# import sys
# import os
# import configparser

# InputA = 36
# InputB = 31
# LedR = 33
# config = configparser.ConfigParser()

# def picEvent(pin):
#         time.sleep(sleepy)
#         # camera.capture('/ram/Camera/CAM%.2d.jpg' % camnumber)
#         # camera.close()

#         for i in list(range(10)):
#             GPIO.output(LedR, GPIO.LOW) #led off
#             time.sleep(.125)
#             GPIO.output(LedR, GPIO.HIGH) #led on
#             time.sleep(.125)
#         print (okay)
#         sys.exit()
        
# def shutEvent(pin):
#     #future video mode
#     global seshNum
#     seshNum = 0
    
# def main():
    # global camnumber
    # global camera
    # global sleepy
    # GPIO.setmode(GPIO.BOARD)    #Number according to physical location
    # GPIO.setup(InputA, GPIO.IN) #Set pin mode as input
    # GPIO.setup(InputB, GPIO.IN)
    # GPIO.setup(LedR, GPIO.OUT)    #Set pin mode as output   
    # GPIO.output(LedR, GPIO.LOW)

    # GPIO.add_event_detect(InputA,GPIO.FALLING)
    # GPIO.add_event_callback(InputA,picEvent)
    # GPIO.add_event_detect(InputB,GPIO.FALLING)
    # GPIO.add_event_callback(InputB,shutEvent)
    
    
    # GPIO.output(LedR, GPIO.HIGH) #led on

    # hostname = os.uname()[1]
    # garbage1,garbage2,num = hostname.split('a')

    # camnumber=int(num)    
    
    # config.read('/ram/CameraConfig.cfg')
    # currentCamera = config['Camera48'] #
    # allcameras = config['DEFAULT']
    # ccfectU = allcameras['CfectU']
    # ccfectV = allcameras['CfectV']
    # if ccfectU == 'None':
    #     ccfectTup = None
    # else:
    #     ccfectTup = (ccfectU,ccfectV)

    # #TODO
    # #ccamTim = allcameras.getint('countdown')
    # sleepy = (allcameras.getfloat('CameraDelay')*camnumber)

with picamera.PiCamera() as camera:
  camera.resolution = (1024, 768)
  camera.hflip = (True)
  camera.vflip = (True)
  camera.capture('/home/pi/testimg.jpg')
  camera.shutter_speed = 800
  # video mode off

    # camera.rotation = allcameras.getint('Rotation')
    # camera.sharpness = currentCamera.getint('Sharpness')
    # camera.contrast = currentCamera.getint('Contrast')
    # camera.brightness = currentCamera.getint('Brightness')
    # camera.saturation = currentCamera.getint('Saturation')
    # camera.ISO = currentCamera.getint('IsoSpeed')
    # camera.shutter_speed = currentCamera.getint('ShutterSpeed')
    # camera.exposure_compensation = currentCamera.getint('Exposure')
    # camera.zoom = (allcameras.getfloat('ZoomX'),allcameras.getfloat('ZoomY'),allcameras.getfloat('ZoomH'),allcameras.getfloat('ZoomW'))
    # camera.exposure_mode = allcameras['ModeEx']
    # camera.meter_mode = allcameras['ModeMe']
    # camera.awb_mode = allcameras['ModeWb']
    # camera.image_effect = allcameras['EfectA']
    # camera.color_effects = (ccfectTup)


    


       # camera.close()
        
    # while True:
    #     time.sleep(10)



# def destroy():
#     for i in list(range(5)):
#         GPIO.output(LedR, GPIO.LOW) #led off
#         time.sleep(.250)
#         GPIO.output(LedR, GPIO.HIGH) #led on
#         time.sleep(.500)
#     time.sleep(5)
#     GPIO.cleanup()              #release resource

# if __name__ == '__main__':   # Program start from here    
#     try:
#         main()
#     except KeyboardInterrupt: # Press 'Ctrl-C' to end the program
#         destroy()
#     except SystemExit: # Runs when sys.exit() is called
#         destroy()
