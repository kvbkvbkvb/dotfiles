-- Catppuccin Latte (light) color palette
return {
  black = 0xff4C4F69,
  white = 0xffEFF1F5,
  red = 0xffD20F39,
  green = 0xff40A02B,
  blue = 0xff1E66F5,
  yellow = 0xffDF8E1D,
  orange = 0xffFE640B,
  magenta = 0xff8839EF,
  pink = 0xffEA76CB,
  teal = 0xff179299,
  grey = 0xff9CA0B0,
  transparent = 0x00000000,

  bar = { bg = 0xf0EFF1F5, border = 0xffE6E9EF },
  popup = { bg = 0xc0E6E9EF, border = 0xffCCD0DA },
  bg1 = 0xffE6E9EF,
  bg2 = 0xffCCD0DA,

  with_alpha = function(color, alpha)
    if alpha > 1.0 or alpha < 0.0 then return color end
    return (color & 0x00ffffff) | (math.floor(alpha * 255.0) << 24)
  end,
}
