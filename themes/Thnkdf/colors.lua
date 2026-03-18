return {
  black = 0xff181819,
  white = 0xffe2e2e3,
  red = 0xffFF5555,
  green = 0xff6ECD6B,
  blue = 0xff6B9FFF,
  yellow = 0xffFFD02A,
  orange = 0xffFF9838,
  magenta = 0xffBB66DD,
  pink = 0xffFF4488,
  teal = 0xff5EE0D4,
  grey = 0xff7f8490,
  transparent = 0x00000000,

  bar = { bg = 0xf02c2e34, border = 0xff2c2e34 },
  popup = { bg = 0xc02c2e34, border = 0xff7f8490 },
  bg1 = 0xff363944,
  bg2 = 0xff414550,

  with_alpha = function(color, alpha)
    if alpha > 1.0 or alpha < 0.0 then return color end
    return (color & 0x00ffffff) | (math.floor(alpha * 255.0) << 24)
  end,
}
