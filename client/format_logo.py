import os
from PIL import Image

def remove_background():
    # Load the logo image
    logo_path = r"c:\Users\lenovo\OneDrive\Desktop\FullStack Movie App\client\src\assets\logo.png"
    
    if not os.path.exists(logo_path):
        print(f"File not found: {logo_path}")
        return
        
    img = Image.open(logo_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    
    # Let's get the background color by inspecting the top-left pixel
    bg_color = datas[0]
    # Small tolerance for compression artifacts
    tolerance = 15
    
    # Loop through every pixel
    for item in datas:
        # If the pixel is close to background, make it transparent
        if abs(item[0] - bg_color[0]) <= tolerance and \
           abs(item[1] - bg_color[1]) <= tolerance and \
           abs(item[2] - bg_color[2]) <= tolerance:
            newData.append((255, 255, 255, 0)) # fully transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(logo_path, "PNG")
    print(f"Successfully processed and saved {logo_path} with transparent background")

if __name__ == "__main__":
    remove_background()
