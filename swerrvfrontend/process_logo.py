from PIL import Image

def process_logo():
    img = Image.open('public/images/swerrve logofinal.png').convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    bg_color = datas[0]
    is_bg_transparent = (bg_color[3] < 10)
    
    for item in datas:
        if item[3] < 10:
            new_data.append((255, 255, 255, 0))
        elif not is_bg_transparent and sum(abs(item[i] - bg_color[i]) for i in range(3)) < 60:
            new_data.append((255, 255, 255, 0))
        else:
            # If it's effectively a shadow or anti-aliasing, keep proportional alpha
            if not is_bg_transparent:
                # simple approximation for anti-aliasing against white/black bg
                # we just make it solid white for simplicity
                new_data.append((255, 255, 255, 255))
            else:
                # If original had transparency, make the non-transparent part white
                # but keep original alpha to preserve anti-aliasing
                new_data.append((255, 255, 255, item[3]))
            
    img.putdata(new_data)
    img.save('public/images/swerrve_logo_white.png', "PNG")
    print("Logo processed successfully!")

if __name__ == "__main__":
    process_logo()
