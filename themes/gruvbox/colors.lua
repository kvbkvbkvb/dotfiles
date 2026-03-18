-- Gruvbox Dark color palette (https://github.com/morhetz/gruvbox)
return {
  black = 0xff282828,
  white = 0xffEBDBB2,
  red = 0xffCC241D,
  green = 0xff98971A,
  blue = 0xff458588,
  yellow = 0xffD79921,
  orange = 0xffD65D0E,
  magenta = 0xffB16286,
  pink = 0xffD3869B,
  teal = 0xff689D6A,
  grey = 0xff928374,
  transparent = 0x00000000,

  bar = { bg = 0xf0282828, border = 0xff3C3836 },
  popup = { bg = 0xc0282828, border = 0xff504945 },
  bg1 = 0xff3C3836,
  bg2 = 0xff504945,

  with_alpha = function(color, alpha)
    if alpha > 1.0 or alpha < 0.0 then return color end
    return (color & 0x00ffffff) | (math.floor(alpha * 255.0) << 24)
  end,
}
