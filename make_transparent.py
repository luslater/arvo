from PIL import Image

def process_logo():
    # Load original image
    img = Image.open("public/arvo-logo.png").convert("RGBA")
    datas = img.getdata()
    
    # We will create a White logo on a Transparent background
    newData = []
    has_color = False
    
    for item in datas:
        # Calculate grayscale luma
        luma = int(item[0] * 0.299 + item[1] * 0.587 + item[2] * 0.114)
        
        # We want the black text (luma=0) to become opaque (alpha=255) white (255,255,255)
        # We want the white bg (luma=255) to become transparent (alpha=0)
        
        alpha = 255 - luma
        newData.append((255, 255, 255, alpha))

    img.putdata(newData)
    img.save("public/arvo-logo-transparent.png", "PNG")
    print("Created public/arvo-logo-transparent.png")

process_logo()
