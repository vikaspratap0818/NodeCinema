from PIL import Image
import os

def crop_transparent_borders():
    logo_path = r"c:\Users\lenovo\OneDrive\Desktop\FullStack Movie App\client\src\assets\logo.png"
    favicon_path = r"c:\Users\lenovo\OneDrive\Desktop\FullStack Movie App\client\public\favicon.png"
    
    if os.path.exists(logo_path):
        with Image.open(logo_path).convert("RGBA") as img:
            # Find the bounding box of the non-transparent area
            bbox = img.getbbox()
            if bbox:
                # Crop the image to the bounding box
                cropped_img = img.crop(bbox)
                # Overwrite original logo so it looks bigger everywhere
                cropped_img.save(logo_path, "PNG")
                print(f"Cropped logo.png to remove transparent padding. New size: {cropped_img.size}")
                
                # Also create a few standard favicon sizes just in case
                fav_128 = cropped_img.resize((128, 128), Image.Resampling.LANCZOS)
                fav_128.save(favicon_path, "PNG")
                print("Created tightly cropped 128x128 favicon.png in public/")
            else:
                print("Image is entirely transparent.")
    else:
        print("Logo not found")

if __name__ == "__main__":
    crop_transparent_borders()
