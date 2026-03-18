-- Nord color palette (https://www.nordtheme.com/)
return {
  black = 0xff2E3440,
  white = 0xffECEFF4,
  red = 0xffBF616A,
  green = 0xffA3BE8C,
  blue = 0xff81A1C1,
  yellow = 0xffEBCB8B,
  orange = 0xffD08770,
  magenta = 0xffB48EAD,
  pink = 0xffB48EAD,
  teal = 0xff88C0D0,
  grey = 0xff4C566A,
  transparent = 0x00000000,

  bar = { bg = 0xf02E3440, border = 0xff3B4252 },
  popup = { bg = 0xc03B4252, border = 0xff4C566A },
  bg1 = 0xff3B4252,
  bg2 = 0xff434C5E,

  with_alpha = function(color, alpha)
    if alpha > 1.0 or alpha < 0.0 then return color end
    return (color & 0x00ffffff) | (math.floor(alpha * 255.0) << 24)
  end,
}
